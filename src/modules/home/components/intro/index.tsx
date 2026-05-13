import Image from 'next/image';
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function IntroSection() {
  return (
    <div className="w-full flex justify-center items-start bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1350px] w-full border-4 border-primary bg-white lg:py-14">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          <div className="w-full lg:w-1/2 flex justify-start">
            <Image 
              src="/images/banner/handimage.png" 
              alt="Hand with plant" 
              width={1430}
              height={480.01}
              className="w-full max-w-[500px] h-auto object-contain"
            />
          </div>

          <div className="px-3 pb-4 md:px-0 w-full lg:w-1/2 flex flex-col items-start">
            <h1 className="text-secondary text-[26px] lg:text-[35px] font-normal mb-2">
              Η φιλοσοφία μας
            </h1>
            
            <p className="text-primary text-[12px] sm:text-base lg:text-[16px] leading-relaxed mb-6">
              Η ψυχική και σωματική σας ευεξία μέσω καθαρών και οργανικών προϊόντων
              υψηλής θρεπτικής αξίας, με ωφέλιμες ιδιότητες.
              Προτεραιότητα μας η διασφάλιση της ποιότητας των προϊόντων που παρέχουμε
              στους πελάτες μας, φέροντας τις απαραίτητες πιστοποιήσεις από έγκυρους και
              αναγνωρισμένους σε παγκόσμιο επίπεδο οργανισμούς!
            </p>

            <LocalizedClientLink href={"/about-us"} className="bg-secondary text-[12px] lg:text-[14px] text-white px-8 py-2 lg:px-8 lg:py-2 rounded-[5.42px] hover:opacity-90 transition-opacity mb-8">
              Μάθε περισσότερα
            </LocalizedClientLink>

            <div className="flex flex-wrap gap-1 lg:gap-4 items-center justify-start w-full">
              <Image 
                src="/images/hero/crueltyfree.png" 
                alt="Cruelty Free" 
                width={64}
                height={64}
                className="h-16 w-auto object-contain"
              />
              <Image 
                src="/images/hero/chemicalfree.png" 
                alt="Chemical Free" 
                width={64}
                height={64}
                className="h-16 w-auto object-contain"
              />
              <Image 
                src="/images/hero/100organics.png" 
                alt="100% Organic" 
                width={64}
                height={64}
                className="h-16 w-auto object-contain"
              />
              <Image 
                src="/images/hero/nottestedonanimals.png" 
                alt="Not Tested on Animals" 
                width={64}
                height={64}
                className="h-16 w-auto object-contain"
              />
              <Image 
                src="/images/hero/natural.png" 
                alt="Natural" 
                width={64}
                height={64}
                className="h-16 w-auto object-contain"
              />
              <Image 
                src="/images/hero/parabenfree.png" 
                alt="Paraben Free" 
                width={64}
                height={64}
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}