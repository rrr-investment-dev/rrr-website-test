import postcssGlobalData from '@csstools/postcss-global-data';
import postcssCustomMedia from 'postcss-custom-media';
import tailwindcssPostcss from '@tailwindcss/postcss';

export default {
  plugins: [
    postcssGlobalData({
      files: [
        './src/styles/media-queries.css'
      ]
    }),
    postcssCustomMedia(),
    tailwindcssPostcss()
  ],
};
