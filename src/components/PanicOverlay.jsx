import React from 'react';
import { BookOpen, CheckCircle, FileText, ArrowRight } from 'lucide-react';

export const PanicOverlay = ({ isActive, onExit }) => {
  if (!isActive) return null;

  return (
    <div
      id="panic-overlay-screen"
      className="fixed inset-0 z-50 bg-white text-slate-800 font-sans flex flex-col overflow-y-auto"
    >
      {/* Classroom Top Bar */}
      <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
            ≡
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium text-slate-700">Google</span>
            <span className="text-xl font-normal text-slate-600">Classroom</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-500 font-medium">Period 3 - AP Chemistry</div>
          <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
            S
          </div>
        </div>
      </div>

      {/* Main Course Content */}
      <div className="max-w-4xl mx-auto w-full p-6 sm:p-8 flex-1">
        {/* Banner */}
        <div className="w-full h-40 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 p-6 text-white flex flex-col justify-end shadow-sm mb-6">
          <h1 className="text-2xl font-bold">AP Chemistry: Module 4</h1>
          <p className="text-emerald-100 text-sm">Thermochemistry & Hess's Law Calculations</p>
        </div>

        {/* Assignments stream */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
              <h3 className="text-sm font-bold text-slate-800 mb-2">Upcoming Work</h3>
              <div className="text-xs text-slate-500 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Lab Report #4 (Due Today, 11:59 PM)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Chapter 6 Review Questions</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Assignment: Calorimetry Lab Simulation</h4>
                  <p className="text-xs text-slate-500">Posted by Dr. Evans • Sep 14</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Please complete the heat transfer calculations for the neutralization reaction in your laboratory notebooks.
                Show all work including specific heat capacity of aqueous solution (4.184 J/g°C).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Secret Restore Trigger at the very bottom right */}
      <button
        id="exit-panic-screen-btn"
        onClick={onExit}
        className="fixed bottom-3 right-3 text-[10px] text-slate-400 hover:text-slate-700 bg-slate-100 border border-slate-300 rounded px-2 py-1 opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1"
        title="Resume Games (or press '[' key)"
      >
        <span>Return to Games [</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
