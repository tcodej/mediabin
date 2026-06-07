import { useState } from 'react';

export default function CopyButton(props) {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.text);
      setIsCopied(true);
      
      setTimeout(() => setIsCopied(false), 2000);

    } catch (error) {
      console.error(`Failed to copy text: ${props.text}`, error);
    }
  };

	return (
		<div className={`btn-copy${isCopied ? ' copied' : ''}`} onClick={handleCopy}>{props.children}</div>
	);
}