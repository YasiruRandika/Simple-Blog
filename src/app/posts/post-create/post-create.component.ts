import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  isLoading = false;
  form : FormGroup;
  imagePreview : string;
  private postId : string = '';
  post : Post = {title: '', content : '', id:''};

  @Output()
  postCreated = new EventEmitter();

  constructor(public postService:PostService, public route : ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators:[Validators.required]}),
      'image' : new FormControl(null, {validators: [Validators.required]})
    });
    this.route.paramMap.subscribe((paraMap: ParamMap) => {
      if(paraMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paraMap.get("postId")||'';
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        });
        this.form.setValue( {
          'title':this.post.title,
          'content':this.post.content
        });
        this.isLoading = false;
      } else {
        this.mode = 'create';
      }
    });
  }

  onAddPost() {
    if(this.form.invalid) {
      return;
    }

    if(this.mode == 'create') {
   this.postService.addPost(this.form.value.title, this.form.value.content);
   this.form.reset();
  } else {
    this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content);
   this.form.reset();
  }
}

onImagePick(event : Event) {
  const file = (event.target as HTMLInputElement).files[0];
  this.form.patchValue({image:file});
  this.form.get('image')?.updateValueAndValidity();
  const reader = new FileReader();
  reader.onload = () =>  {
    this.imagePreview = reader.result;
  };
  reader.readAsDataURL(file);
}

}
