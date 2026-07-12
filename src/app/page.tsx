"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { BookOpen, Target, Award, ArrowRight, Sparkles, TrendingUp, Users, Clock } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Solved Papers",
      desc: "Access thousands of real past papers with detailed, step-by-step solutions",
      color: "from-primary to-primary/80"
    },
    {
      icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "AI Mock Tests",
      desc: "Adaptive tests powered by AI to target and strengthen your weak areas",
      color: "from-primary to-accent"
    },
    {
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Progress Analytics",
      desc: "Track your performance with insightful analytics and personalized recommendations",
      color: "from-accent to-accent/80"
    },
  ];

  const stats = [
    { icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />, label: "10K+", desc: "Active Students" },
    { icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />, label: "5K+", desc: "Past Papers" },
    { icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />, label: "95%", desc: "Success Rate" },
    { icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />, label: "24/7", desc: "Available" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-primary/5 to-accent/5 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary/20 dark:bg-primary/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-accent/20 dark:bg-accent/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary/15 dark:bg-primary/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Welcome Message */}
          <div className="animate-fade-in animate-bounce-slow">
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium inline-block bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
              🎓 Welcome to PPSC Prep - Your Path to Success! 🎓
            </p>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-primary to-accent rounded-xl sm:rounded-2xl blur-xl opacity-50"></div>
              <div className="relative bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl">
                <Image
                  src="/LoginLogo.png"
                  alt="PPSC"
                  width={48}
                  height={48}
                  className="sm:w-16 sm:h-16 animate-bounce-slow"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-primary to-accent text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">AI-Powered Exam Preparation</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight px-4">
              <span className="bg-linear-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent animate-gradient">
                Crack Your PPSC Exam
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Master your exam with <span className="font-semibold text-primary">AI-powered practice</span>, 
              {" "}thousands of solved past papers, and smart analytics that track your progress
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 px-4">
              <button
                onClick={() => router.push("/register")}
                className="group relative inline-flex items-center justify-center gap-2 bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
              >
                <span>Start Free Preparation</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-primary/50 to-accent/50 opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
              </button>

              <button
                onClick={() => router.push("/practice")}
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-primary dark:hover:border-primary transition-all duration-200 text-sm sm:text-base"
              >
                Try Demo Practice
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 pt-8 sm:pt-12 animate-fade-in-up delay-200 px-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 bg-linear-to-br from-primary to-accent rounded-lg sm:rounded-xl text-white">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.label}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.desc}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="pt-12 sm:pt-16 md:pt-20 space-y-4 sm:space-y-6 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Everything you need to <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">succeed</span>
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-transparent group-hover:from-primary/10 group-hover:to-accent/10 rounded-xl sm:rounded-2xl transition-all duration-300"></div>
                  <div className={`relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br ${feature.color} rounded-xl sm:rounded-2xl mb-4 text-white shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="relative pt-12 sm:pt-16 md:pt-20 px-4">
            <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-accent/10 rounded-2xl sm:rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
                Why choose PPSC Prep?
              </h3>
              <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="shrink-0 w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">AI-Powered Learning</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Personalized mock tests that adapt to your performance</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="shrink-0 w-10 h-10 bg-linear-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white text-lg sm:text-xl">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">Verified Content</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Thousands of real past papers with expert solutions</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="shrink-0 w-10 h-10 bg-linear-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">Smart Analytics</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Track progress, set goals, and beat deadlines</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="pt-10 sm:pt-12 md:pt-16 px-4">
            <div className="bg-linear-to-r from-primary to-accent rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Ready to ace your exam?
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join thousands of successful candidates and start your preparation journey today
              </p>
              <button
                onClick={() => router.push("/register")}
                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 transform hover:-translate-y-0.5 transition-all duration-200 shadow-xl"
              >
                <span>Start Preparing Now</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in 0.8s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
