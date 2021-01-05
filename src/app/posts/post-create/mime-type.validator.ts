import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";

export const mimeTYPE = (contorl : AbstractControl) : Promise<{[key:string] : any}> | Observable<{[key:string] : any}> => {
  const file = contorl.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create((observer: Observer<{[key:string] : any}> | Observable<{[key:string] : any}> ) => {
    fileReader.addEventListener("loadend", () => {
      const array = new Uint8Array(fileReader.result).subarray(0, 4);
    });
    fileReader.readAsArrayBuffer(file);
  });
};
