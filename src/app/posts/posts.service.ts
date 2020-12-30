import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({providedIn:'root'})
export class PostService {
  private posts : Post[] = [];
  private postUpdated = new Subject<Post[]>();
  private postUpd = new Subject<Post>();

  constructor(private http:HttpClient) {}

  getPosts() {
    this.http.get<{message:string, posts:any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content:post.content,
          id: post._id
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

  addPost(title:string, content:string) {
    const post: Post = {
      title:title,
      content:content,
      id:'dfdf'
    };

    this.http.post<{message:string, postId:string}>('http://localhost:3000/api/post', post)
    .subscribe((ResponseData) => {
      console.log(ResponseData.message);
      post.id =ResponseData.postId;
      this.posts.push(post);
    this.postUpdated.next([...this.posts]);
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
    this.http.get<{message:string, post:any}>('http://localhost:3000/api/posts' + id)
    .pipe(map((postData) => {
      return postData.post.map(post => {
        return {
          title: post.title,
          content:post.content,
          id: post._id
        }
      })
    }))
    .subscribe((transformedPost) => {
      this.posts = transformedPost;
      this.postUpd.next(transformedPost);
    });
  }
}
