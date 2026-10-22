import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface DistributorBannerProps {
  formUrl?: string;
}

export default function DistributorBanner({
  formUrl = "https://docs.google.com/forms/d/e/1FAIpQLScgXNpr8Hja_Azd0v6x2moBjJbYmwP-tLbRvnQUIZXWzGAFeQ/viewform?usp=sharing&ouid=115929252466889515193",
}: DistributorBannerProps) {
  return (
    <section className="w-full bg-[#FBF9F5] py-8 sm:py-12 border-[#E8E3DA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        <a
          href={formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block relative w-full overflow-hidden rounded-xs border border-[#E8E3DA] shadow-2xs hover:shadow-md transition-all duration-300"
          title="Click to apply to become an authorized Maysha distributor"
          aria-label="Become an Authorized Maysha Distributor"
        >
          {/* Responsive container matching exact 2172x724 aspect ratio (3:1) - strictly zero cropping */}
          <div className="w-full relative aspect-[2172/724] bg-[#EFECE4] overflow-hidden">
            <Image
              src="/images/Maysha_India_Distributor_Banner.png"
              alt="Become an Authorized Maysha Distributor — Clean Botanical Skincare"
              width={2172}
              height={724}
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1360px) 100vw, 1360px"
              className="w-full h-full object-contain block transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </div>

          {/* Subtle click indicator pill */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-white/95 backdrop-blur-xs text-[#1A1A1A] px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-[#E8E3DA] shadow-xs flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:bg-[#4E5942] group-hover:text-white transition-all">
            <span>Apply Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </a>
      </div>
    </section>
  );
}
