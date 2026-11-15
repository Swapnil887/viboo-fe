import { Truck, ShieldCheck, RefreshCcw, Headset } from "lucide-react";

const benefits = [
  {
    id: 1,
    title: "Free Shipping",
    description: "On eligible orders",
    icon: Truck,
  },
  {
    id: 2,
    title: "Secure Payments",
    description: "100% secure checkout",
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: "Easy Returns",
    description: "Hassle-free returns",
    icon: RefreshCcw,
  },
  {
    id: 4,
    title: "Customer Support",
    description: "We're here to help",
    icon: Headset,
  },
];

export default function BenefitsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid grid-cols-2 gap-4 rounded-2xl bg-[#F8F3EE] px-4 py-8 sm:grid-cols-4 sm:gap-6 sm:px-8 lg:px-12">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <div
              key={benefit.id}
              className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#B77950]">
                <Icon className="h-5 w-5" strokeWidth={1.7} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#292521]">
                  {benefit.title}
                </h3>

                <p className="mt-1 text-xs text-[#756B63]">
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
