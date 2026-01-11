import React, { useEffect, useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../../context/UserContext";
import { CourseData } from "../../../context/CourseContext";
import Testimonials from "../../../components/ui/testimonials/Testimonials";
import Footer from "../../../components/ui/footer/Footer";
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Star,
  Clock,
  ChevronRight,
  PlayCircle,
  FileText,
  MonitorPlay,
  CheckCircle2,
} from "lucide-react";
import Header from "../../../components/ui/header/Header";
import { server } from "../../../utils/config";

const Home = () => {
  const navigate = useNavigate();
  const { fetchFeaturedCourses } = CourseData();

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      setLoadingCourses(true);
      try {
        const data = await fetchFeaturedCourses();
        setCourses(data || []);
      } catch (err) {
        console.error("Error loading featured courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    }

    loadFeatured();
  }, []);

  const stats = [
    { icon: Users, value: "50K+", label: "Active Students" },
    { icon: BookOpen, value: "500+", label: "Online Courses" },
    { icon: Award, value: "95%", label: "Success Rate" },
    { icon: TrendingUp, value: "4.8/5", label: "Average Rating" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section
        className="text-center py-20 text-white flex flex-col justify-center items-center"
        style={{
          background: "linear-gradient(135deg, #1E3A8A 0%, #0D9488 100%)",
        }}
      >
        <h1 className="text-5xl lg:text-7xl font-bold mb-6">
          Transform Your Future
          <span className="block mt-2">With Online Learning</span>
        </h1>

        <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
          Access world-class courses from industry experts. Learn at your own
          pace, anywhere, anytime.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/account"
            className="bg-white text-green-700 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            Get Started Free <ChevronRight size={20} />
          </a>

          <a
            href="#courses"
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all"
          >
            Explore Courses
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div
              key={i}
              className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-md transition"
            >
              <s.icon size={32} className="mx-auto text-green-600 mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{s.value}</h3>
              <p className="text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">
            Featured Courses
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {loadingCourses ? (
              <p className="text-gray-600 text-lg">Loading courses...</p>
            ) : courses.length === 0 ? (
              <p className="text-gray-600 text-lg">
                No courses available right now.
              </p>
            ) : (
              courses.map((c) => (
                <div
                  key={c._id || c.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition"
                >
                  <img src={c?.image?.startsWith("http") ? c.image : `${server}${c.image}`}
                    alt={c.title}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-6 text-left">
                    <h3 className="text-xl font-semibold mb-2">{c.title}</h3>

                    <p className="text-gray-500 mb-2">
                      {c.instructor || c.tutorName}
                    </p>

                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Star className="text-yellow-500 mr-1" size={16} />
                      {c.rating ?? 4.5}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Clock className="mr-1" size={16} />
                      {c.duration || "30 hours"}
                    </div>

                    <div className="flex justify-between items-center">
                      {/* Commented out - all courses are free for now */}
                      {/* <span className="text-lg font-bold">
                        {c.price ? `₹${c.price}` : "Free"}
                      </span> */}
                      <span className="text-lg font-bold text-green-600">
                        Free
                      </span>

                      <button
                        onClick={() => navigate(`/course/${c._id || c.id}`)}
                        className="flex items-center text-green-600 hover:text-emerald-600 font-semibold transition"
                      >
                        Enroll <ChevronRight className="ml-1" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600"
            className="rounded-xl shadow-lg"
            alt="About LearnHub"
          />
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              About LearnHub
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              LearnHub is a modern e-learning platform designed to make
              high-quality education accessible to everyone.
            </p>

            <p className="text-gray-600 mt-4">
              With interactive videos, assignments, certificates and real-time
              progress tracking, we ensure a smooth and joyful learning
              experience.
            </p>

            <button
              onClick={() => navigate("/about")}
              className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Inside Every Course */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">
            What’s Inside Every Course?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
              <PlayCircle size={40} className="mx-auto text-green-600 mb-3" />
              <h3 className="text-xl font-semibold">Video Lessons</h3>
              <p className="text-gray-500 mt-2">
                High-quality recordings by top instructors.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
              <FileText size={40} className="mx-auto text-green-600 mb-3" />
              <h3 className="text-xl font-semibold">Assignments</h3>
              <p className="text-gray-500 mt-2">
                Practical tasks to improve your skills.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
              <MonitorPlay size={40} className="mx-auto text-green-600 mb-3" />
              <h3 className="text-xl font-semibold">Live Sessions</h3>
              <p className="text-gray-500 mt-2">
                Weekly live doubt-solving classes.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
              <CheckCircle2 size={40} className="mx-auto text-green-600 mb-3" />
              <h3 className="text-xl font-semibold">Certificates</h3>
              <p className="text-gray-500 mt-2">
                Earn a certificate for each completed course.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Contact */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-xl">
              <Mail className="mx-auto text-green-600 mb-2" />
              <p>support@learnhub.com</p>
            </div>

            <div className="p-6 border rounded-xl">
              <Phone className="mx-auto text-green-600 mb-2" />
              <p>+1 800 123 4567</p>
            </div>

            <div className="p-6 border rounded-xl">
              <MapPin className="mx-auto text-green-600 mb-2" />
              <p>123 Education St, California</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
