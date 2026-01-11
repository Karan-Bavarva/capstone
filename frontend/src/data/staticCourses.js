// Static fallback courses used when API returns no data
const staticCourses = [
  {
    _id: "static-c1",
    title: "Introduction to Web Development",
    description: "Learn HTML, CSS and JavaScript to build modern web apps.",
    instructor: "Jane Doe",
    price: 0,
    image: "https://via.placeholder.com/600x360?text=Course+Image",
    lessons: 12,
    duration: "6h 30m",
  },
  {
    _id: "static-c2",
    title: "React for Beginners",
    description: "A practical guide to building components and hooks.",
    instructor: "John Smith",
    price: 19.99,
    image: "https://via.placeholder.com/600x360?text=Course+Image",
    lessons: 18,
    duration: "9h 10m",
  },
  {
    _id: "static-c3",
    title: "Node.js & Express",
    description: "Backend fundamentals: APIs, middleware and auth.",
    instructor: "Alex Johnson",
    price: 29.99,
    image: "https://via.placeholder.com/600x360?text=Course+Image",
    lessons: 14,
    duration: "7h 45m",
  },
];

export default staticCourses;
