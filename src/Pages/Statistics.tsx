import React from "react";

export function Statistics() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-blue-darkBlue">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Quick summary of your workspace</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-brightness-light rounded-2xl p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-darkBlue mb-2">Tasks Overview</h3>
            <p className="text-sm text-gray-500">Chart or task breakdown goes here.</p>
          </div>

          <aside className="bg-brightness-primary rounded-2xl p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-darkBlue mb-2">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button className="w-full px-4 py-2 bg-blue-darkBlue text-white rounded">
                Create Project
              </button>
              <button className="w-full px-4 py-2 bg-white border rounded">Invite Member</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
