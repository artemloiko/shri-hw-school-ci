declare module 'ansi-to-html' {
  export interface ConverterOptions {
    fg?: string;
    bg?: string;
    newline?: boolean;
    escapeXML?: boolean;
    stream?: boolean;
    colors?: string[] | { [key: string]: string };
  }

  declare class Converter {
    constructor(options: ConverterOptions);

    toHtml(ansi: string): string;
  }

  export default Converter;
}
