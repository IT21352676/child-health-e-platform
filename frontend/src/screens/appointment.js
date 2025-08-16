import { AlertCircle, CheckCircle, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "../components/header";

const BASE_API = `${process.env.REACT_APP_API_URL}/appointment`;

// Simple Calendar Component
function SimpleCalendar({ selectedDate, onChange }) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = selectedDate.getDate() === day;
    const isPast = new Date(year, month, day) < new Date().setHours(0, 0, 0, 0);

    days.push(
      <button
        key={day}
        onClick={() => !isPast && onChange(new Date(year, month, day))}
        disabled={isPast}
        className={`p-2 text-sm rounded transition-colors ${
          isSelected
            ? "bg-[#6a0d0d] text-white"
            : isPast
            ? "text-gray-300 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="p-4">
      <div className="text-xl mb-4 text-center font-semibold text-[#6a0d0d]">
        {currentDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-xs font-semibold text-center text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
}

// Time Slot Picker Component
function TimeSlotPicker({
  selectedTime,
  onChange,
  selectedDate,
  availableSlots,
  isLoading,
}) {
  if (isLoading) {
    return (
      <div className="mt-4">
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Select Time
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-2 bg-gray-100 rounded animate-pulse h-10"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-md font-semibold text-gray-700 mb-2">Select Time</h3>
      <div className="grid grid-cols-3 gap-2">
        {availableSlots.map(({ time, isPast, isBooked, isAvailable }) => (
          <button
            key={time}
            onClick={() => isAvailable && onChange(time)}
            disabled={!isAvailable}
            className={`p-2 text-sm rounded transition-colors relative ${
              selectedTime === time
                ? "bg-[#6a0d0d] text-white"
                : isPast
                ? "text-gray-300 cursor-not-allowed bg-gray-100"
                : isBooked
                ? "text-red-500 cursor-not-allowed bg-red-50 border border-red-200"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {time}
            {isBooked && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                ×
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <span>Past</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 border border-gray-300 rounded"></div>
          <span>Available</span>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [appointments, setAppointments] = useState({
    pending: [],
    completed: [],
    vaccines: [],
  });
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [userAppointments, setUserAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  console.log(userAppointments);

  // Mock user ID - in a real app, this would come from authentication
  const userId = user.user_id;

  // Helper function to format appointment date and time
  const formatAppointmentDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const dateStr = date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { date: dateStr, time: timeStr };
  };

  // Helper function to get status color and icon
  const getStatusDisplay = (status) => {
    switch (status) {
      case "PENDING":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          icon: Clock,
          text: "Pending",
        };
      case "CONFIRMED":
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          icon: CheckCircle,
          text: "Confirmed",
        };
      case "COMPLETED":
        return {
          color: "text-green-600",
          bgColor: "bg-green-100",
          icon: CheckCircle,
          text: "Completed",
        };
      case "CANCELLED":
        return {
          color: "text-red-600",
          bgColor: "bg-red-100",
          icon: AlertCircle,
          text: "Cancelled",
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          icon: Clock,
          text: status || "Unknown",
        };
    }
  };

  const services = [
    { id: 1, name: "Vaccination" },
    { id: 2, name: "Well Baby Clinic" },
    { id: 3, name: "Pediatric Consultation" },
    { id: 4, name: "Growth Monitoring" },
    { id: 5, name: "Immunization Follow-up" },
    { id: 6, name: "Maternal Care" },
    { id: 7, name: "Nutrition Counseling" },
    { id: 8, name: "Family Planning" },
    { id: 9, name: "Emergency Child Care" },
  ];

  const handleSubmitAppointment = async () => {
    if (!selectedService || !selectedTime) {
      setMessage({
        type: "error",
        text: "Please select both a service and time slot",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Create the appointment datetime in ISO format
      const [hours, minutes] = selectedTime.split(":");
      const appointmentDateTime = new Date(selectedDate);
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const requestBody = {
        user_id: userId,
        service_id: selectedService.id,
        appointment_datetime: appointmentDateTime.toISOString(),
      };

      console.log("Sending appointment request:", requestBody);

      const response = await fetch(`${BASE_API}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: "Appointment created successfully!",
        });

        // Reset form
        setSelectedService(null);
        setSelectedTime("");
        setSelectedDate(new Date());

        // Refresh appointments and existing appointments
        fetchUserAppointments();
        if (selectedService) {
          fetchExistingAppointments(selectedService.id);
        }
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to create appointment",
        });
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      setMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all appointments for a specific service to show existing dates
  const fetchExistingAppointments = async (serviceId) => {
    try {
      const response = await fetch(`${BASE_API}/getAll/${serviceId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setExistingAppointments(data.data || []);
      } else {
        console.error("Failed to fetch existing appointments:", data.error);
      }
    } catch (error) {
      console.error("Error fetching existing appointments:", error);
    }
  };

  // Fetch user's appointments
  const fetchUserAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const response = await fetch(
        `${BASE_API}/get-user-appointment/${userId}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        const appointments = data.data || [];

        // Categorize appointments by status
        const pending = appointments.filter((apt) => apt.status === "pending");
        const completed = appointments.filter((apt) => apt.status === "accept");
        const vaccines = appointments.filter(
          (apt) =>
            apt.status === "pending" ||
            (apt.status === "accept" &&
              (apt.service_name?.toLowerCase().includes("vaccine") ||
                apt.service_name?.toLowerCase().includes("vaccination") ||
                apt.service_name?.toLowerCase().includes("immunization")))
        );

        setUserAppointments(appointments);
        setAppointments({
          pending,
          completed: completed.filter((apt) => !vaccines.includes(apt)),
          vaccines,
        });
      } else {
        console.error("Failed to fetch user appointments:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user appointments:", error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Check if a date/time slot is already booked
  const isTimeSlotBooked = (date, time) => {
    if (!selectedService) return false;

    const [hours, minutes] = time.split(":").map(Number);
    const slotDateTime = new Date(date);
    slotDateTime.setHours(hours, minutes, 0, 0);

    return existingAppointments.some((appointment) => {
      const appointmentDate = new Date(appointment.appointment_datetime);
      return appointmentDate.getTime() === slotDateTime.getTime();
    });
  };

  // Get available time slots for selected date and service
  const getAvailableTimeSlots = () => {
    const timeSlots = [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
    ];

    const isToday = selectedDate.toDateString() === new Date().toDateString();
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();

    return timeSlots.map((time) => {
      const [hour, minute] = time.split(":").map(Number);
      const isPast =
        isToday &&
        (hour < currentHour ||
          (hour === currentHour && minute <= currentMinute));
      const isBooked = isTimeSlotBooked(selectedDate, time);

      return {
        time,
        isPast,
        isBooked,
        isAvailable: !isPast && !isBooked,
      };
    });
  };

  // Fetch user appointments on component mount
  useEffect(() => {
    fetchUserAppointments();
  }, [userId]);

  // Fetch existing appointments when service changes
  useEffect(() => {
    if (selectedService) {
      fetchExistingAppointments(selectedService.id);
    }
  }, [selectedService]);

  // Clear time selection when date changes
  useEffect(() => {
    if (selectedTime) {
      // Check if the selected time is still available on the new date
      const availableSlots = getAvailableTimeSlots();
      const isTimeStillAvailable = availableSlots.find(
        (slot) => slot.time === selectedTime && slot.isAvailable
      );

      if (!isTimeStillAvailable) {
        setSelectedTime("");
      }
    }
  }, [selectedDate, existingAppointments]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div>
      <Header />

      {/* Main content with top padding to account for fixed header */}
      <div className="max-w-3xl mx-auto pt-24 p-4 bg-[#FFF8F8] min-h-screen">
        {/* Status Message */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Make Appointment */}
        <h2 className="text-xl font-bold mb-3 text-[#6a0d0d]">
          Make Appointment
        </h2>
        <div className="p-4 bg-white shadow-md rounded-xl">
          <SimpleCalendar
            selectedDate={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />

          <TimeSlotPicker
            selectedTime={selectedTime}
            onChange={setSelectedTime}
            selectedDate={selectedDate}
            availableSlots={getAvailableTimeSlots()}
            isLoading={!selectedService}
          />

          <div className="mt-4">
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              Select a Service
            </h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {services.map((service) => (
                <button
                  key={service.id}
                  className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors text-sm shadow-sm ${
                    selectedService?.id === service.id
                      ? "bg-[#6a0d0d] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedService(service);
                    setSelectedTime(""); // Reset time when service changes
                    fetchExistingAppointments(service.id);
                  }}
                >
                  {service.name}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Appointment Summary */}
          {(selectedService || selectedTime) && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">
                Appointment Summary:
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Date:</strong> {selectedDate.toLocaleDateString()}
                </p>
                {selectedTime && (
                  <p>
                    <strong>Time:</strong> {selectedTime}
                  </p>
                )}
                {selectedService && (
                  <p>
                    <strong>Service:</strong> {selectedService.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmitAppointment}
            disabled={!selectedService || !selectedTime || isLoading}
            className={`w-full mt-4 py-3 px-4 rounded-lg font-semibold transition-colors ${
              !selectedService || !selectedTime || isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#6a0d0d] text-white hover:bg-[#5a0a0a]"
            }`}
          >
            {isLoading ? "Creating Appointment..." : "Book Appointment"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mt-8 border-b border-gray-300">
          <button
            className={`flex-1 py-2 font-semibold transition-colors ${
              activeTab === "pending"
                ? "text-[#6a0d0d] border-b-2 border-[#6a0d0d]"
                : "text-gray-500 hover:text-[#6a0d0d]"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`flex-1 py-2 font-semibold transition-colors ${
              activeTab === "completed"
                ? "text-[#6a0d0d] border-b-2 border-[#6a0d0d]"
                : "text-gray-500 hover:text-[#6a0d0d]"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
          <button
            className={`flex-1 py-2 font-semibold transition-colors ${
              activeTab === "vaccine"
                ? "text-[#6a0d0d] border-b-2 border-[#6a0d0d]"
                : "text-gray-500 hover:text-[#6a0d0d]"
            }`}
            onClick={() => setActiveTab("vaccine")}
          >
            Vaccinations
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "pending" && (
          <div className="grid gap-4 mt-4">
            {loadingAppointments ? (
              // Loading skeleton
              [1, 2].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-lg shadow animate-pulse"
                >
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : appointments.pending.length > 0 ? (
              appointments.pending.map((appt, idx) => {
                const { date, time } = formatAppointmentDateTime(
                  appt.appointment_datetime
                );
                const statusDisplay = getStatusDisplay(appt.status);
                const StatusIcon = statusDisplay.icon;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-[#6a0d0d]">
                        {appt.service_name ||
                          `Ref NO: ${appt.reference_number}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {date} - {time}
                      </p>
                      {appt.appointment_id && (
                        <p className="text-xs text-gray-400">
                          ID: {appt.appointment_id}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${statusDisplay.bgColor} ${statusDisplay.color}`}
                      >
                        {statusDisplay.text}
                      </span>
                      <StatusIcon className={statusDisplay.color} size={20} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No pending appointments</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="grid gap-4 mt-4">
            {loadingAppointments ? (
              // Loading skeleton
              [1, 2].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-lg shadow animate-pulse"
                >
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : appointments.completed.length > 0 ? (
              appointments.completed.map((appt, idx) => {
                const { date, time } = formatAppointmentDateTime(
                  appt.appointment_datetime
                );

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-[#6a0d0d]">
                        {appt.service_name ||
                          `Ref NO: ${appt.reference_number}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {date} - {time}
                      </p>
                      {appt.appointment_id && (
                        <p className="text-xs text-gray-400">
                          ID: {appt.appointment_id}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                        Completed
                      </span>
                      <CheckCircle className="text-green-500" size={20} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No completed appointments</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "vaccine" && (
          <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3">
            {loadingAppointments ? (
              // Loading skeleton
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-lg shadow animate-pulse"
                >
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              ))
            ) : appointments.vaccines.length > 0 ? (
              appointments.vaccines.map((vaccine, idx) => {
                const { date, time } = formatAppointmentDateTime(
                  vaccine.appointment_datetime
                );

                return (
                  <div
                    key={idx}
                    className="flex flex-col justify-between p-4 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
                  >
                    <p className="font-semibold text-[#6a0d0d]">
                      {vaccine.service_name ||
                        `Ref NO: ${vaccine.reference_number}`}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">Date: {date}</p>
                    {vaccine.appointment_id && (
                      <p className="text-xs text-gray-400 mb-2">
                        ID: {vaccine.appointment_id}
                      </p>
                    )}
                    <span className="px-2 py-1 text-xs text-green-600 bg-green-100 rounded-full w-fit">
                      Completed
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <User size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No vaccination records</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
