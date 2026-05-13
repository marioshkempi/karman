export default function HeroSection() {
  return (
    <section className="relative mb-[2.5rem] lg:mb-6 h-[350px] md:h-[644.38px] z-0">

      <div className="absolute inset-0 hidden md:block">
        <img 
          src="/images/hero/bg-blue.svg" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 md:hidden">
        <img 
          src="/images/hero/bg-blue.svg" 
          alt="" 
          className="w-full h-full object-cover"
        />
        <img 
          src="/images/hero/bg-tree.png" 
          alt="" 
          className="absolute -bottom-5 left-0 w-full h-auto"
        />
      </div>

      <div className="relative z-10 h-full flex items-center lg:overflow-visible">
        <div className="max-w-[1350px] w-full mx-auto px-6 py-14 md:py-10 lg:overflow-visible lg:relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-0 md:gap-12 lg:overflow-visible lg:relative lg:items-center">
            
            <div className="w-full md:w-1/2 lg:mb-32">

              <h1 className="text-secondary text-[18px] lg:text-[30px] font-semibold leading-tight mb-2">
                Σάπων ο Φαρμακευτής
              </h1>

              <h2 className="text-secondary text-[16px] lg:text-[30px] font-normal leading-tight mb-4 lg:mb-6">
                Σαπούνι - Μαύρη Πεύκη (Κατράμι-Pine Tar)
              </h2>

              <p className="text-secondary text-[12px] lg:text-[18px] leading-relaxed mb-4 lg:mb-6">
                Μείωση συμπτωμάτων ψωρίασης, εκζέματος, μυκητιάσεις, δερματίτιδες, 
                κατάλληλο για ευαίσθητες περιοχές, ιδανικό για λιπαρά μαλλιά, 
                πιτυρίδα, τριχόπτωση, ξηροδερμία.
              </p>

              <div className="hidden md:flex items-center gap-4 lg:mb-6">
                <img 
                  src="/images/hero/crueltyfree.png" 
                  alt="Cruelty Free" 
                  className="h-16 w-auto"
                />
                <img 
                  src="/images/hero/chemicalfree.png" 
                  alt="Chemical Free" 
                  className="h-16 w-auto"
                />
                <img 
                  src="/images/hero/100organics.png" 
                  alt="100% Organic" 
                  className="h-16 w-auto"
                />
                <img 
                  src="/images/hero/nottestedonanimals.png" 
                  alt="Not Tested on Animals" 
                  className="h-16 w-auto"
                />
                <img 
                  src="/images/hero/natural.png" 
                  alt="Natural" 
                  className="h-16 w-auto"
                />
                <img 
                  src="/images/hero/parabenfree.png" 
                  alt="Paraben Free" 
                  className="h-16 w-auto"
                />
              </div>

              <div className="pt-3">
                <button className="bg-secondary text-white px-5 py-2 lg:px-8 lg:py-3 text-[12px] rounded hover:opacity-90 transition-opacity font-medium">
                  Μάθε περισσότερα
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:hidden flex justify-center md:justify-end md:relative">
              <img 
                src="/images/hero/soap.png" 
                alt="Σαπούνι Μαύρη Πεύκη" 
                className="absolute right-0 -bottom-4 md:relative md:right-auto md:bottom-auto w-[250px] md:w-[910px] md:h-[629.75px] object-contain"
              />
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 z-20">
          <img 
            src="/images/hero/soap.png" 
            alt="Σαπούνι Μαύρη Πεύκη" 
            className="w-[800px] h-[600px] object-contain"
          />
        </div>
      </div>

      <div className="absolute bottom-4 hidden left-1/2 -translate-x-1/2 lg:flex gap-2 z-10">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === 0 ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}