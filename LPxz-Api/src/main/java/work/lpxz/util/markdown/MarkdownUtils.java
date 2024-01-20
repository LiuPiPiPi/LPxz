package work.lpxz.util.markdown;

import org.commonmark.Extension;
import org.commonmark.ext.gfm.strikethrough.StrikethroughExtension;
import org.commonmark.ext.gfm.tables.TableBlock;
import org.commonmark.ext.gfm.tables.TablesExtension;
import org.commonmark.ext.heading.anchor.HeadingAnchorExtension;
import org.commonmark.ext.task.list.items.TaskListItemsExtension;
import org.commonmark.node.Link;
import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.AttributeProvider;
import org.commonmark.renderer.html.HtmlRenderer;
import work.lpxz.util.markdown.ext.blackscreen.BlackScreenExtension;
import work.lpxz.util.markdown.ext.cover.CoverExtension;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Markdown 转换
 *
 * @author LPxz
 * @date 2024/1/13
 */
public class MarkdownUtils {

    /**
     * markdown 格式转换成 HTML 格式
     */
    public static String markdownToHtml(String markdown) {
        Parser parser = Parser.builder().build();
        Node document = parser.parse(markdown);
        HtmlRenderer renderer = HtmlRenderer.builder().build();
        return renderer.render(document);
    }

    /**
     * 增加扩展
     */
    public static String markdownToHtmlExtensions(String markdown) {
        // 为 h 标签生成 id 供 toc bot 目录生成
        Set<Extension> headingAnchorExtensions = Collections.singleton(HeadingAnchorExtension.create());
        // 转换 table 的 HTML
        List<Extension> tableExtension = List.of(TablesExtension.create());
        // 任务列表
        Set<Extension> taskListExtension = Collections.singleton(TaskListItemsExtension.create());
        // 删除线
        Set<Extension> delExtension = Collections.singleton(StrikethroughExtension.create());
        // 黑幕
        Set<Extension> blackScreenExtension = Collections.singleton(BlackScreenExtension.create());
        // 遮盖层
        Set<Extension> coverExtension = Collections.singleton(CoverExtension.create());
        Parser parser = Parser.builder()
                .extensions(tableExtension)
                .extensions(taskListExtension)
                .extensions(delExtension)
                .extensions(blackScreenExtension)
                .extensions(coverExtension)
                .build();
        Node document = parser.parse(markdown);
        HtmlRenderer renderer = HtmlRenderer.builder()
                .extensions(headingAnchorExtensions)
                .extensions(tableExtension)
                .extensions(taskListExtension)
                .extensions(delExtension)
                .extensions(blackScreenExtension)
                .extensions(coverExtension)
                .attributeProviderFactory(context -> new CustomAttributeProvider())
                .build();
        return renderer.render(document);
    }

    /**
     * 处理标签的属性
     */
    static class CustomAttributeProvider implements AttributeProvider {
        @Override
        public void setAttributes(Node node, String tagName, Map<String, String> attributes) {
            // 改变 a 标签的 target 属性为 _blank
            if (node instanceof Link) {
                attributes.put("target", "_blank");
                attributes.put("rel", "external nofollow noopener");
            }
            if (node instanceof TableBlock) {
                attributes.put("class", "ui celled table"); // 针对 semantic-ui 的 class 属性
            }
        }
    }


    public static void main(String[] args) {
        System.out.println(markdownToHtmlExtensions(""));
    }

}
