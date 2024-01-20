package work.lpxz.util.markdown.ext.blackscreen;

import org.commonmark.Extension;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.NodeRenderer;
import org.commonmark.renderer.html.HtmlNodeRendererContext;
import org.commonmark.renderer.html.HtmlNodeRendererFactory;
import org.commonmark.renderer.html.HtmlRenderer;
import org.commonmark.renderer.text.TextContentNodeRendererContext;
import org.commonmark.renderer.text.TextContentNodeRendererFactory;
import org.commonmark.renderer.text.TextContentRenderer;
import work.lpxz.util.markdown.ext.blackscreen.internal.BlackScreenDelimiterProcessor;
import work.lpxz.util.markdown.ext.blackscreen.internal.BlackScreenHtmlNodeRenderer;
import work.lpxz.util.markdown.ext.blackscreen.internal.BlackScreenTextNodeRenderer;

/**
 * @author LPxz
 * @date 2024/1/14
 */
public class BlackScreenExtension implements Parser.ParserExtension, HtmlRenderer.HtmlRendererExtension, TextContentRenderer.TextContentRendererExtension {

    private BlackScreenExtension() {
    }

    public static Extension create() {
        return new BlackScreenExtension();
    }

    @Override
    public void extend(Parser.Builder parserBuilder) {
        parserBuilder.customDelimiterProcessor(new BlackScreenDelimiterProcessor());
    }

    @Override
    public void extend(HtmlRenderer.Builder rendererBuilder) {
        rendererBuilder.nodeRendererFactory(new HtmlNodeRendererFactory() {
            @Override
            public NodeRenderer create(HtmlNodeRendererContext context) {
                return new BlackScreenHtmlNodeRenderer(context);
            }
        });
    }

    @Override
    public void extend(TextContentRenderer.Builder rendererBuilder) {
        rendererBuilder.nodeRendererFactory(new TextContentNodeRendererFactory() {
            @Override
            public NodeRenderer create(TextContentNodeRendererContext context) {
                return new BlackScreenTextNodeRenderer(context);
            }
        });
    }
}
