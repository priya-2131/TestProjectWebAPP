import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  apiKeyForm: FormGroup;
  submitted = false;
  displayedColumns: string[] = ['expand', 'title', 'section'];
  articles: any = [];

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.apiKeyForm = this.formBuilder.group({
      apiKey: ['', [Validators.required, Validators.minLength(16)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.apiKeyForm.invalid) {
      return;
    }

    const apiKey = this.apiKeyForm.value.apiKey;

    this.http
      .post(
        'http://localhost:50264/api/Article/SubmitArticle?apiKey=' + apiKey,
        null
      )
      .subscribe({
        next: (response: any) => {
          console.log('API key validated successfully:', response);
          this.articles = response.results;
          console.log(this.articles);
          this.articles = this.transformArticlesToTree(response.results || []);
        },
        error: (error) => {
          console.error('Error validating API key:', error);
          alert('Invalid API Key.');
        },
      });
  }

  transformArticlesToTree(articles: any[]): any[] {
    return articles.map((article) => ({
      title: article.title,
      section: article.section,
      abstract: article.abstract,
      expanded: false, // Add expanded property for toggle
      children: article.multimedia
        ? article.multimedia.map((media: any) => ({
            title: `${media.caption || 'No Caption'}`,
            section: media.format,
            abstract: media.url,
            expanded: false,
          }))
        : [],
    }));
  }

  toggleExpand(node: any) {
    node.expanded = !node.expanded;
  }
}
