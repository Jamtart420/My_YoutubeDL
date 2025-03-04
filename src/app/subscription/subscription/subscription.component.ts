import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditSubscriptionDialogComponent } from 'app/dialogs/edit-subscription-dialog/edit-subscription-dialog.component';
import { Subscription } from 'api-types';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, OnDestroy {

  id: string | null = null;
  subscription: Subscription | null = null;
  use_youtubedl_archive = false;
  descendingMode = true;
  downloading = false;
  sub_interval: any = null;
  check_clicked = false;
  cancel_clicked = false;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.clearSubscriptionInterval();

      this.postsService.service_initialized.subscribe(init => {
        if (init) {
          this.getConfig();
          this.getSubscription();
          this.startSubscriptionPolling();
        }
      });
    });
  }

  ngOnDestroy() {
    this.clearSubscriptionInterval();
  }

  goBack() {
    this.router.navigate(['/subscriptions']);
  }

  private clearSubscriptionInterval(): void {
    if (this.sub_interval) {
      clearInterval(this.sub_interval);
    }
  }

  private startSubscriptionPolling(): void {
    this.sub_interval = setInterval(() => this.getSubscription(true), 1000);
  }

  private getSubscription(low_cost = false): void {
    this.postsService.getSubscription(this.id).subscribe(res => {
      const newSubscription = res['subscription'];
      if (low_cost && newSubscription.videos.length === this.subscription?.videos.length) {
        if (newSubscription['downloading'] !== this.subscription?.['downloading']) {
          this.subscription['downloading'] = newSubscription['downloading'];
        }
        return;
      }

      if (newSubscription.videos.length > (this.subscription?.videos.length || 0)) {
        this.postsService.files_changed.next(true);
      }
      this.subscription = newSubscription;
    });
  }

  private getConfig(): void {
    this.use_youtubedl_archive = this.postsService.config['Downloader']['use_youtubedl_archive'];
  }

  downloadContent(): void {
    this.downloading = true;
    this.postsService.downloadSubFromServer(this.subscription!.id).subscribe(
      res => {
        this.downloading = false;
        const blob: Blob = res;
        saveAs(blob, `${this.subscription!.name}.zip`);
      },
      err => {
        console.error(err);
        this.downloading = false;
      }
    );
  }

  editSubscription(): void {
    this.dialog.open(EditSubscriptionDialogComponent, {
      data: { sub: this.postsService.getSubscriptionByID(this.subscription!.id) }
    });
  }

  watchSubscription(): void {
    this.router.navigate(['/player', { sub_id: this.subscription!.id }]);
  }

  checkSubscription(): void {
    this.check_clicked = true;
    this.postsService.checkSubscription(this.subscription!.id).subscribe(
      res => {
        this.check_clicked = false;
        if (!res['success']) {
          this.postsService.openSnackBar('Failed to check subscription!');
        }
      },
      err => {
        console.error(err);
        this.check_clicked = false;
        this.postsService.openSnackBar('Failed to check subscription!');
      }
    );
  }

  cancelCheckSubscription(): void {
    this.cancel_clicked = true;
    this.postsService.cancelCheckSubscription(this.subscription!.id).subscribe(
      res => {
        this.cancel_clicked = false;
        if (!res['success']) {
          this.postsService.openSnackBar('Failed to cancel check subscription!');
        }
      },
      err => {
        console.error(err);
        this.cancel_clicked = false;
        this.postsService.openSnackBar('Failed to cancel check subscription!');
      }
    );
  }

}
