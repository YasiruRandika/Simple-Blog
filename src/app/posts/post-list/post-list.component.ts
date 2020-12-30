import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { Subscription} from "rxjs";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  constructor(public postService:PostService) { }

  posts: Post[] = [];
  private postsSub : Subscription = new Subscription();

  ngOnInit(): void {
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListner().subscribe((posts:Post[]) => {
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onDelete(postId:string) {
    this.postService.deletePost(postId);
  }

  /*posts = [
    {title:'First Post', content:'This is the first post'},
    {title:'Second Post', content:'This is the second post'},
    {title:'Third Post', content:'This is the third post'}
  ]*/

}
