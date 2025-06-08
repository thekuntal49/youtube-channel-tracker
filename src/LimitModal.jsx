import React, { useState } from "react";
import { X, AlertCircle, Zap, Clock, RefreshCw } from "lucide-react";

function LimitModal({ showLimitModal, setShowLimitModal }) {
  return (
    <div className=" bg-slate-900 flex items-center justify-center">
      {/* Limit Reached Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          showLimitModal ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowLimitModal(false)}
        ></div>

        {/* Modal */}
        <div
          className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full mx-4 border border-slate-700/50 shadow-2xl transform transition-all duration-300 ${
            showLimitModal
              ? "scale-100 translate-y-0"
              : "scale-95 translate-y-4"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowLimitModal(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors duration-200 hover:bg-slate-700/50 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              Daily Limit Reached! 🚫
            </h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              You've hit your daily search limit. Our servers need a breather!
              Come back tomorrow for more awesome YouTube analytics.
            </p>

            {/* Alternative Options */}
            <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
              <h4 className="text-white font-medium mb-2">
                Want More Searches?
              </h4>
              <p className="text-slate-400 text-sm mb-3">
                Upgrade to Pro for unlimited daily searches and advanced
                analytics
              </p>
              <a
                href="http://codesena.site/"
                target="_blank"
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                Upgrade to Pro ✨
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LimitModal;
