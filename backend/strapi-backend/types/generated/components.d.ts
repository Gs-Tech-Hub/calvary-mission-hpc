import type { Schema, Struct } from '@strapi/strapi';

export interface AboutUsFeature extends Struct.ComponentSchema {
  collectionName: 'components_about_us_features';
  info: {
    displayName: 'Feature';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OrgHeroText extends Struct.ComponentSchema {
  collectionName: 'components_org_hero_text';
  info: {
    displayName: 'Hero Text';
    icon: 'heading';
  };
  attributes: {
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OrgSocials extends Struct.ComponentSchema {
  collectionName: 'components_org_socials';
  info: {
    displayName: 'Socials';
    icon: 'link';
  };
  attributes: {
    facebook: Schema.Attribute.String;
    instagram: Schema.Attribute.String;
    youtube: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about-us.feature': AboutUsFeature;
      'org.hero-text': OrgHeroText;
      'org.socials': OrgSocials;
    }
  }
}
