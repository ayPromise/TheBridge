import type { Schema, Struct } from '@strapi/strapi';

export interface BookAuthor extends Struct.ComponentSchema {
  collectionName: 'components_book_authors';
  info: {
    description: '';
    displayName: 'Author';
    icon: 'user';
  };
  attributes: {
    firstName: Schema.Attribute.String & Schema.Attribute.Required;
    lastName: Schema.Attribute.String;
    middleName: Schema.Attribute.String;
  };
}

export interface BookEpigraph extends Struct.ComponentSchema {
  collectionName: 'components_book_epigraphs';
  info: {
    description: '';
    displayName: 'Epigraph';
    icon: 'pencil';
  };
  attributes: {
    author: Schema.Attribute.String & Schema.Attribute.Required;
    paragraphs: Schema.Attribute.JSON;
  };
}

export interface BookNote extends Struct.ComponentSchema {
  collectionName: 'components_book_notes';
  info: {
    description: '';
    displayName: 'note';
    icon: 'book';
  };
  attributes: {
    paragraphs: Schema.Attribute.JSON & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BookParagraph extends Struct.ComponentSchema {
  collectionName: 'components_book_paragraphs';
  info: {
    displayName: 'Paragraph';
    icon: 'bulletList';
  };
  attributes: {};
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'book.author': BookAuthor;
      'book.epigraph': BookEpigraph;
      'book.note': BookNote;
      'book.paragraph': BookParagraph;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
