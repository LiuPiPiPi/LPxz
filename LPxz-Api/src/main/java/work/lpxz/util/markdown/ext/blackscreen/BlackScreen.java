package work.lpxz.util.markdown.ext.blackscreen;

import org.commonmark.node.CustomNode;
import org.commonmark.node.Delimited;

/**
 * A black node containing text and other inline nodes as children.
 *
 * @author LPxz
 * @date 2024/1/14
 */
public class BlackScreen extends CustomNode implements Delimited {

    private static final String DELIMITER = "@@";

    @Override
    public String getOpeningDelimiter() {
        return DELIMITER;
    }

    @Override
    public String getClosingDelimiter() {
        return DELIMITER;
    }

}
