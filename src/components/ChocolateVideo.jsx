export default function ChocolateVideo() {
  return (
    <section className="w-full h-[100vh] relative overflow-hidden my-12">
      <video
        className="w-full h-full object-cover"
        src="/videos/chocolate.mp4"
        autoPlay
        loop
        muted
        playsInline
      ></video>
    
    
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-4 animate-fadeIn">
          About ChocoNut
        </h2>
        <p className="text-white max-w-2xl text-lg md:text-xl animate-fadeIn delay-200">
          At ChocoNut, we craft premium chocolates and nuts with love and passion.
          Our ingredients are carefully selected to ensure freshness, taste, and
          the perfect indulgence for every chocolate lover. Experience the joy of
          quality in every bite.
        </p>
      </div>
    </section>
  );
}
