document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generate');
    const topEventInput = document.getElementById('top-event');
    const faultTree = document.getElementById('fault-tree');

    generateButton.addEventListener('click', generateFaultTree);

    function generateFaultTree() {
        const topEvent = topEventInput.value.trim();
        if (topEvent === '') {
            alert('Please enter a top event.');
            return;
        }

        // Show loading indicator
        faultTree.innerHTML = '<p>Generating fault tree...</p>';

        fetch('/industry/pi/ehs/deviation/analysis/fault_tree/generate_fault_tree', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ top_event: topEvent }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            renderFaultTree(data);
        })
        .catch((error) => {
            console.error('Error:', error);
            faultTree.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        });
    }

    function renderFaultTree(tree) {
        faultTree.innerHTML = '';
        const rootNode = createNode(tree.name);
        faultTree.appendChild(rootNode);
        renderChildren(tree, rootNode);
    }

    function renderChildren(node, parentElement) {
        if (node.children && node.children.length > 0) {
            const connector = document.createElement('div');
            connector.className = 'connector';
            parentElement.appendChild(connector);

            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'children';
            parentElement.appendChild(childrenContainer);

            node.children.forEach(child => {
                const childElement = document.createElement('div');
                childElement.className = 'child';
                const childNode = createNode(child.name);
                childElement.appendChild(childNode);
                childrenContainer.appendChild(childElement);
                renderChildren(child, childElement);
            });
        }
    }

    function createNode(text) {
        const element = document.createElement('div');
        element.className = 'node';
        const content = document.createElement('div');
        content.className = 'node-content';
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.placeholder = 'Enter text here';
        content.appendChild(textarea);
        element.appendChild(content);
        return element;
    }
});