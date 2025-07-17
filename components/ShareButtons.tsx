import { useEffect } from "react";

const ShareButtons = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.addtoany.com/menu/page.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="a2a_kit a2a_kit_size_32 a2a_default_style">
        <a className="a2a_button_facebook"></a>
    </div>
  );
};

export default ShareButtons;
