import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  detailsCollection: AngularFirestoreCollection<any>;
  details: Observable<any[]>;

  paginatorLength: number;
  pageSize: number = 10;
  currentPageIndex: number = 0;

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore
  ) {
    this.detailsCollection = this.firestore.collection('contactForms', (ref) =>
      ref.orderBy('timestamp', 'desc')
    );
    this.details = this.detailsCollection.valueChanges();

    this.formGroup = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      description: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.updatePaginatorLength();
    this.updatePagedData(this.currentPageIndex, this.pageSize);
  }

  updatePaginatorLength() {
    this.details.subscribe((data) => {
      this.paginatorLength = data.length;
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedData(this.currentPageIndex, this.pageSize);
  }

  updatePagedData(pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.details = this.detailsCollection
      .valueChanges()
      .pipe(map((data) => data.slice(startIndex, endIndex)));
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const formData = this.formGroup.value;
      formData.timestamp = new Date();
      this.detailsCollection
        .add(formData)
        .then(() => {
          alert('Formularz został przesłany. Niedługo się odezwiemy.');
          this.formGroup.reset();
          this.updatePaginatorLength();
          this.updatePagedData(this.currentPageIndex, this.pageSize);
        })
        .catch((error) => {
          console.error('Błąd podczas przesyłania danych:', error);
          alert('Wystąpił błąd. Spróbuj ponownie później.');
        });
    }
  }
}
