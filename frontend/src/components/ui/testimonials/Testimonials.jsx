import React from "react";

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "John Doe",
      position: "Student",
      message:
        "This platform helped me learn so effectively. The courses are amazing and the instructors are top-notch.",
      image:
        "https://th.bing.com/th?q=Current+Bachelor&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock",
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "Student",
      message:
        "I've learned more here than anywhere else. The interactive lessons and quizzes make learning enjoyable and fun.",
      image:
        "https://th.bing.com/th/id/OIP.GKAiW3oc2TWXVEeZAzrWOAHaJF?w=135&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    {
      id: 3,
      name: "David Wilson",
      position: "Student",
      message:
        "Highly recommended! The structure of the courses helps you learn step-by-step without feeling overwhelmed.",
      image:
        "https://th.bing.com/th/id/OIP.GKAiW3oc2TWXVEeZAzrWOAHaJF?w=135&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    {
      id: 4,
      name: "Sophia Brown",
      position: "Student",
      message:
        "The instructors are supportive and the platform design is clean and easy to use. Love the learning experience!",
      image:
        "https://th.bing.com/th?q=Current+Bachelor&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock",
    },
  ];

  return (
    <section
      className="py-20 text-white"
      style={{
        background:
          "linear-gradient(135deg, #1E3A8A 0%, #0D9488 100%)",
      }}
    >
      <h2 className="text-center text-4xl font-bold mb-12">
        What Our Students Say
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {testimonialsData.map((item) => (
          <div
            key={item.id}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 hover:-translate-y-2 transition-all duration-300"
          >
            <div className="flex justify-center mb-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
              />
            </div>

            <p className="text-white/90 text-sm leading-relaxed mb-4">
              “{item.message}”
            </p>

            <div className="text-center">
              <p className="font-semibold text-lg">{item.name}</p>
              <p className="text-sm text-green-100">{item.position}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
