import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  @Output()
  postCreated = new EventEmitter();

  constructor(public postService:PostService) { }

  ngOnInit(): void {
  }

  onAddPost(form : NgForm) {
    if(form.invalid) {
      return;
    }

   this.postService.addPost(form.value.title, form.value.content);
   form.resetForm();
  }

}
