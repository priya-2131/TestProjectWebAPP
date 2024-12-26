import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environment';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
})
export class ArticlesComponent {
  apiKeyForm: FormGroup;
  submitted = false;
  displayedColumns: string[] = ['expand', 'title', 'section'];
  articles: any = [];

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.apiKeyForm = this.formBuilder.group({
      apiKey: ['', [Validators.required]],
    });
  }

  onSubmit() {
    debugger;
    this.submitted = true;
    if (this.apiKeyForm.invalid) {
      return;
    }

    const apiKey = this.apiKeyForm.value.apiKey;

    this.http
      .post(
        `${environment.API_URL}Article/SubmitArticle?apiKey=${apiKey}`,
        null
      )
      .subscribe({
        next: (response: any) => {
          this.articles = response.results;
          this.articles = this.transformArticlesToTree(response.results || []);
        },
        error: (error) => {
          if (error.status === 401) {
            debugger;
            alert('Invalid API Key. Please provide a valid key.');
          } else {
            alert('An error occurred while processing your request.');
          }
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
