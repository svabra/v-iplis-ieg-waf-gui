import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentLabels: string[] = [];
  labelInputCtrl = new FormControl();
  private baseUrl: string = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchLabels();
  }

  fetchLabels() {
    this.http.get<{labels: string[]}>(`${this.baseUrl}/labels/`).subscribe(data => {
      this.currentLabels = data.labels;
    });
  }

  add(event: any) {
    const input = event.input;
    const value = event.value.trim();

    // Add label
    if (value) {
      this.currentLabels.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.labelInputCtrl.setValue(null);
    this.updateLabels();
  }

  remove(label: string) {
    const index = this.currentLabels.indexOf(label);

    if (index >= 0) {
      this.currentLabels.splice(index, 1);
      this.updateLabels();
    }
  }

  updateLabels() {
    const labels = this.currentLabels;
    this.http.post(`${this.baseUrl}/labels/`, {labels}).subscribe(() => {
      this.fetchLabels();
    });
  }
}