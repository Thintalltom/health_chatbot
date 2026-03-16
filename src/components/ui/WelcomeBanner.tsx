import Person from '../../assets/svgs/person.svg'
import sun from '../../assets/svgs/sun.svg'
export function WelcomeBanner() {
  return (
    <div
      className="w-full rounded-[32px] overflow-hidden relative shadow-[0px_1px_1px_rgba(0,0,0,0.04)] px-8 py-10 md:px-10 md:py-12"
      style={{
        background:
        'linear-gradient(180deg, #6AA8FF 0%, #418BF5 45%, #1F5EDB 100%)'
      }}>

      <div className="max-w-[600px] relative z-10 flex flex-col items-start">
        <h1 className="font-satoshi font-medium text-[36px] flex gap-[2px] items-center text-white tracking-tight mb-3">
          Welcome, Dr Joanne! <span> <img src={sun}  alt='weather' /></span>
        </h1>
        <p className="font-satoshi text-[18px] text-[#FAFAFA] opacity-90 leading-relaxed mb-8 max-w-[540px]">
          Lorem ipsum elementum maecenas placerat faucibus bibendum senectus
          lacinia lacinia duis quis
        </p>
        <button className="bg-white hover:bg-gray-50 transition-colors text-[#418BF5] font-satoshi font-bold text-[16px] px-6 py-3 rounded-xl shadow-sm">
          Start Consultations
        </button>
      </div>

      {/* Doctor Image */}
      <div className="absolute right-0 -bottom-0 w-[280px] md:w-[320px] h-auto pointer-events-none hidden sm:block" style={{ top: '-10%' }}>
        <img
          src={Person}
          alt="Doctor"
          className="w-full h-full "
          // style={{
          //   WebkitMaskImage:
          //   'linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)',
          //   maskImage:
          //   'linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)'
          // }} 
          />

      </div>
    </div>);

}