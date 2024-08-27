import {useState} from "react";





function TreeNode({ node }) {
    const { children, label } = node;
  
    const [showChildren, setShowChildren] = useState(false);
  
    const handleClick = () => {
      setShowChildren(!showChildren);
    };
    return (
      <>
        <div onClick={handleClick} style={{ marginBottom: "10px" }}>
          <span>{label}</span>
        </div>
        <ul style={{ paddingLeft: "10px", borderLeft: "1px solid black" }}>
          {showChildren && <Tree treeData={children} />}
        </ul>
      </>
    );
  }
  

  export const Tree = ({ treeData }) => {
    return (
        <ul>
        {treeData.map((node) => (
            <TreeNode node={node} key={node.key} />
        ))}
        </ul>
    );
}

export default Tree;