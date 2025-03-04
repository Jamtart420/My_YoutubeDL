import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { PostsService } from 'app/posts.services';
import { Playlist } from 'api-types';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.scss']
})
export class CreatePlaylistComponent implements OnInit {

  filesToSelectFrom = null;
  audiosToSelectFrom = null;
  videosToSelectFrom = null;
  name = '';
  cachedThumbnailUrl: string | null = null;

  createInProgress = false;
  createMode = false;

  playlist: Playlist | null = null;
  playlistId: string | null = null;
  preselectedFiles: any[] = [];
  playlistUpdated = false;

  filesSelect = new UntypedFormControl();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private postsService: PostsService,
    public dialogRef: MatDialogRef<CreatePlaylistComponent>
  ) {
    if (this.data?.create_mode) this.createMode = true;
    if (this.data?.playlist_id) {
      this.playlistId = this.data.playlist_id;
      this.getPlaylist();
    }
  }

  ngOnInit(): void {}

  createPlaylist(): void {
    const thumbnailURL = this.getThumbnailURL();
    this.createInProgress = true;
    
    this.postsService.createPlaylist(this.name, this.filesSelect.value, thumbnailURL).subscribe(
      res => {
        this.createInProgress = false;
        this.dialogRef.close(res['success']);
      },
      err => {
        this.createInProgress = false;
        console.error(err);
        this.dialogRef.close(false);
      }
    );
  }

  updatePlaylist(): void {
    this.createInProgress = true;
    this.playlist.name = this.name;
    this.playlist.uids = this.filesSelect.value;
    this.playlistUpdated = true;

    this.postsService.updatePlaylist(this.playlist).subscribe(
      () => {
        this.createInProgress = false;
        this.postsService.openSnackBar($localize`Playlist updated successfully.`);
        this.getPlaylist();
        this.postsService.playlistsChanged.next(true);
      },
      err => {
        this.createInProgress = false;
        console.error(err);
        this.postsService.openSnackBar($localize`Playlist update failed.`);
      }
    );
  }

  getThumbnailURL(): string {
    return this.cachedThumbnailUrl || '';
  }

  fileSelectionChanged({ new_selection, thumbnailURL }: { new_selection: string[], thumbnailURL: string }): void {
    this.filesSelect.setValue(new_selection);
    this.cachedThumbnailUrl = new_selection.length ? thumbnailURL : null;
  }

  playlistChanged(): boolean {
    return JSON.stringify(this.playlist?.uids) !== JSON.stringify(this.filesSelect.value) || this.name !== this.playlist?.name;
  }

  getPlaylist(): void {
    if (!this.playlistId) return;

    this.postsService.getPlaylist(this.playlistId, null, true).subscribe(res => {
      if (res['playlist']) {
        this.filesSelect.setValue(res['file_objs'].map(file => file.uid));
        this.preselectedFiles = res['file_objs'];
        this.playlist = res['playlist'];
        this.name = this.playlist.name;
      }
    });
  }
}
