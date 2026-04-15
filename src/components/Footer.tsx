import { Link } from "react-router-dom";
import { useContentMap } from "@/hooks/useSiteContent";

const Footer = () => {
  const { content: contact } = useContentMap("contact");
  const { content: footer } = useContentMap("footer");

  return (
    <footer className="border-t border-border/30 py-16 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-serif text-gradient-gold mb-4">SALI ARTS</h3>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              {footer.description?.value || "Exclusive handcrafted paintings that transform spaces into galleries. Each piece is unique, original, and crafted with passion."}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-sans tracking-widest uppercase text-foreground mb-4">Navigation</h4>
            <div className="flex flex-col gap-2">
              {["Home", "Gallery", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-sans"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-sans tracking-widest uppercase text-foreground mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground font-sans">
              <p>{contact.email?.value || "contact@saliarts.com"}</p>
              <p>{contact.phone?.value || "+91 98765 43210"}</p>
              <p>{contact.location?.value || "Mumbai, India"}</p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground font-sans tracking-wider">
            © 2024 Sali Arts. All rights reserved. Every painting is an original work of art.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
