package work.lpxz.util.markdown.ext.blackscreen.internal;

import org.commonmark.node.Node;
import org.commonmark.renderer.NodeRenderer;
import work.lpxz.util.markdown.ext.blackscreen.BlackScreen;

import java.util.Collections;
import java.util.Set;

/**
 * @author LPxz
 * @date 2024/1/14
 */
abstract class AbstractBlackScreenNodeRenderer implements NodeRenderer {

    @Override
    public Set<Class<? extends Node>> getNodeTypes() {
        return Collections.<Class<? extends Node>>singleton(BlackScreen.class);
    }

}
