namespace CloudServices.Application.Features.News.Queries.GetNews;
internal static class NewsMapper
{ internal static NewsDto ToDto(Domain.Entities.NewsArticle article) => new(article.Id, article.Title, article.Slug, article.Category, article.Content, article.ThumbnailUrl, article.PublishedAt, article.CreatedAt); }
