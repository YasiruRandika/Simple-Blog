import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({providedIn:'root'})
export class PostService {
  private posts : Post[] = [];
  private postUpdated = new Subject<{posts : Post[], maxPosts : number}>();

  constructor(private http:HttpClient, private router:Router) {}

  getPosts(postsPerPage : number, currentPage:number) {
    const queryParmas = `?pageSize=${postsPerPage}&page=${currentPage}`

    this.http.get<{message:string, posts:{_id:string, title:string, content:string, imagePath:string, creator : string}[], maxPosts : number}>('http://localhost:3000/api/posts' + queryParmas)
    .pipe(map((postData) => {
      return {
      posts : postData.posts.map(post => {
        return {
          title: post.title,
          content:post.content,
          id: post._id,
          imagePath : post.imagePath,
          creator : post.creator
        }
      }), maxPosts : postData.maxPosts};
    }))
    .subscribe((transformedPostData) => {
      this.posts = transformedPostData.posts;
      this.postUpdated.next({posts : [...this.posts], maxPosts : transformedPostData.maxPosts});
    });
  }

  getPostUpdateListner() {
    return this.postUpdated.asObservable();
  }

  addPost(title:string, content:string, image:File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{message:string, post:{ id: string; title: string; content: string, imagePath:string }}>('http://localhost:3000/api/posts', postData)
    .subscribe((ResponseData) => {
    this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
  }

  getPost(id : string) {
    console.log("Get Post Method Call");
    return this.http.get<{ _id: string; title: string; content: string, imagePath:string}>(
      "http://localhost:3000/api/posts/" + id
    );
  }

  updatePost(id:string, title:string, content:string, image : File | string){
    let postData : Post | FormData;
    if(typeof(image) === 'object') {
      postData  = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {id : id, title  :title, content : content, imagePath : image};
    }
    this.http
    .put<{message:string,  imagePath:string}>("http://localhost:3000/api/posts/" + id, postData)
    .subscribe((response) => {
        this.router.navigate(["/"]);
    })
  }
}
