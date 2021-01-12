import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { Subscription} from "rxjs";
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  constructor(public postService:PostService, private authService : AuthService) { }

  posts: Post[] = [];
  private postsSub : Subscription = new Subscription();
  private authSubscription : Subscription = new Subscription();
  isLoding = false;
  totalPosts = 10;
  postsPerPage = 2;
  currentPage = 1;
  postSizeOptions = [2, 5, 10];
  userIsAuthenticated = false;
  userId : string | null = null;
  ngOnInit(): void {
    this.isLoding = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postService.getPostUpdateListner().subscribe((postData : {posts : Post[], maxPosts: number}) => {
      this.posts = postData.posts;
      this.totalPosts = postData.maxPosts;
    });
    this.isLoding = false;
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authSubscription = this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  onDelete(postId:string) {
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  /*posts = [
    {title:'First Post', content:'This is the first post'},
    {title:'Second Post', content:'This is the second post'},
    {title:'Third Post', content:'This is the third post'}
  ]*/

}
