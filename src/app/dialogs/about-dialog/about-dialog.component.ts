import { Component, OnInit } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { CURRENT_VERSION } from 'app/consts';

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss']
})
export class AboutDialogComponent implements OnInit {

  projectLink = 'https://github.com/Tzahi12345/YoutubeDL-Material';
  issuesLink = 'https://github.com/Tzahi12345/YoutubeDL-Material/issues';
  latestUpdateLink = 'https://github.com/Tzahi12345/YoutubeDL-Material/releases/latest';
  latestGithubRelease: any = null;
  checkingForUpdates = true;
  currentVersionTag = CURRENT_VERSION;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.getLatestGithubRelease();
  }

  private getLatestGithubRelease(): void {
    this.postsService.getLatestGithubRelease().subscribe(res => {
      this.checkingForUpdates = false;
      this.latestGithubRelease = res;
    });
  }
}
