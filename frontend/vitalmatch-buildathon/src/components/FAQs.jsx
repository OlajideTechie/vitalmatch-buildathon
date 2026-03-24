import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

function FAQs() {
    const [openIndex, setOpenIndex] = useState(5); // Default to the 6th item (index 5) as seen in the image

  const faqs = [
    {
      question: "Can I decline a blood request?",
      answer: "Yes, you have complete freedom to accept or decline any requests."
    },
    {
      question: "What happens after I accept a request?",
      answer: "Accept Request and Hospital Calls (30 mins) Coordinate Time to  arrive at Hospital"
    },
    {
      question: "What is VitalMatch?",
      answer: "VitalMatch is a hospital-verified blood matching platform that connects patients in urgent need of blood with compatible donors in real-time."
    },
    {
      question: "How fast is the matching process?",
      answer: "VitalMatch matching is INSTANT - typically under 60 seconds from request to donor notification."
    },
    {
      question: "How do I become a donor on Vital Match?",
      answer: "Becoming a VitalMatch donor is quick and easy - just 2 simple steps, sign up and complete your profile"
    },
    {
      question: "Will my personal information be shared publicly?",
      answer: "No! Your personal information remains private and is NEVER shared publicly."
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

    return (
        <div className="pt-12 py-10 px-6 lg:px-8 font-sans flex flex-col items-center">
      
      {/* FAQ Section */}
      <div className="bg-[#121137] rounded-3xl p-8 md:p-10 mb-10 shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 tracking-wide uppercase">
          Frequently Ask Questions (FAQ)
        </h2>

        <div className="flex flex-col">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border-b border-gray-600/50 last:border-none">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center py-5 text-left focus:outline-none"
                >
                  <span className="text-white text-base md:text-lg font-medium pr-8">
                    {faq.question}
                  </span>
                  <span className="text-white shrink-0">
                    {isOpen ? <Minus size={24} strokeWidth={1.5} /> : <Plus size={24} strokeWidth={1.5} />}
                  </span>
                </button>
                
                {/* Answer Dropdown */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-40 opacity-100 mb-5" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-[#A1A2B5] text-sm md:text-base leading-relaxed pr-10">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    )
}

export default FAQs;