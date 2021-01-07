import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({providedIn:'root'})
export class PostService {
  private posts : Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http:HttpClient, private router:Router) {}

  getPosts() {
    this.http.get<{message:string, posts:{_id:string, title:string, content:string, imagePath:string}[]}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content:post.content,
          id: post._id,
          imagePath : post.imagePath
        }
      })
    }))
    .subscribe((transformedPost) => {
      this.posts = transformedPost;
      this.postUpdated.next([...this.posts]);
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
      console.log(ResponseData.message);
      const post : Post = {id : ResponseData.post.id, title: title, content : content, imagePath : ResponseData.post.imagePath}
      post.id =ResponseData.post.id;
      this.posts.push(post);
    this.postUpdated.next([...this.posts]);
    this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      });
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
      const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: response.imagePath
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
    })
  }
}
