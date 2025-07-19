import { useState, useEffect } from 'react';
import type { ReactNode } from 'react'; 
import { createPortal } from 'react-dom';

// Define the type for the component's props
interface PortalProps {
  children: ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  // Use state to hold the container element, which can be null initially
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Find the portal container element in the DOM after the component mounts
    const portalContainer = document.getElementById('modal-root');

    if (portalContainer) {
      setContainer(portalContainer);
    } else {
        console.error("The element with id 'modal-root' was not found in the DOM.");
    }
    
  }, []);

  return container ? createPortal(children, container) : null;
};

export default Portal;