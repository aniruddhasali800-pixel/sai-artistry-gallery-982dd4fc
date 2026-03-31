import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { type Painting } from "@/data/paintings";

interface PaintingCardProps {
  painting: Painting;
  index: number;
}

const PaintingCard = ({ painting, index }: PaintingCardProps) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      className="painting-card-3d group"
    >
      <div className="painting-inner rounded-lg overflow-hidden glass-card">
        <div className="relative overflow-hidden aspect-[4/5]">
          <img
            src={painting.image}
            alt={painting.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Sold Badge */}
          {painting.sold && (
            <div className="absolute top-4 right-4 bg-destructive/90 backdrop-blur-sm px-3 py-1 rounded-sm">
              <span className="text-xs font-sans font-semibold tracking-widest uppercase text-destructive-foreground">
                Sold
              </span>
            </div>
          )}

          {/* Discount Badge */}
          {painting.originalPrice && !painting.sold && (
            <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-sm">
              <span className="text-xs font-sans font-semibold tracking-widest uppercase text-primary-foreground">
                {Math.round((1 - painting.price / painting.originalPrice) * 100)}% Off
              </span>
            </div>
          )}

          {/* Hover Details */}
          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <p className="text-sm text-foreground/80 font-sans leading-relaxed">
              {painting.description}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground font-sans">
              <span>{painting.medium}</span>
              <span>·</span>
              <span>{painting.dimensions}</span>
              <span>·</span>
              <span>{painting.year}</span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-serif text-lg text-foreground">{painting.title}</h3>
              <p className="text-xs text-muted-foreground font-sans tracking-wider uppercase mt-1">
                {painting.category}
              </p>
            </div>
            <div className="text-right">
              <p className="font-serif text-lg text-primary">{formatPrice(painting.price)}</p>
              {painting.originalPrice && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatPrice(painting.originalPrice)}
                </p>
              )}
            </div>
          </div>
          <button
            disabled={painting.sold}
            onClick={() => alert(`Order placed for "${painting.title}"! We will contact you soon.`)}
            className="mt-4 w-full py-3 text-xs font-sans font-semibold tracking-[0.2em] uppercase transition-all duration-500 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/80"
          >
            {painting.sold ? "Sold Out" : "Place Order"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaintingCard;
