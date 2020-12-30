import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId : string|null;
  private post : Post;

  @Output()
  postCreated = new EventEmitter();

  constructor(public postService:PostService, public route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paraMap: ParamMap) => {
      if(paraMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paraMap.get('postId');
        this.post = this.postService.getPost(this.postId || '');
      } else {
        this.mode = 'create';
      }
    });
  }

  onAddPost(form : NgForm) {
    if(form.invalid) {
      return;
    }

   this.postService.addPost(form.value.title, form.value.content);
   form.resetForm();
  }

}
