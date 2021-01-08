import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { mimeType } from "../post-create/mime-type.validator";

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
  public form : FormGroup = new FormGroup({
    'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
    'content': new FormControl(null, {validators:[Validators.required]}),
    'image' : new FormControl(null, {validators: [Validators.required],
    asyncValidators : [mimeType]})
  });;
  imagePreview : string | null | ArrayBuffer = '';
  private postId : string = '';
  post : Post = {title: '', content : '', id:'', imagePath:''};

  @Output()
  postCreated = new EventEmitter();

  constructor(public postService:PostService, public route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paraMap: ParamMap) => {
      if(paraMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paraMap.get("postId")||'';
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.post = {id: postData._id, title: postData.title, content: postData.content, imagePath : postData.imagePath};
          this.form.setValue( {
            'title': this.post.title,
            'content': this.post.content,
            'image': this.post.imagePath
          });
          this.imagePreview = this.post.imagePath;
          console.log(this.post.imagePath+ "Helloo");
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
   this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
  } else {
    this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
   this.form.reset();
  }
}

onImagePick(event : Event) {
  const fileList = (event.target as HTMLInputElement).files;
  if(fileList != null) {
    const file = fileList[0];
    this.form.patchValue({image:fileList[0]});
  this.form.get('image')?.updateValueAndValidity();
  const reader = new FileReader();
  reader.onload = () =>  {
    this.imagePreview = reader.result;
  };
  reader.readAsDataURL(file);
  }
}

}
