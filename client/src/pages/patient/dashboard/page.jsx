import React, { useEffect, useState, useCallback } from "react";
import { socket } from "../../../utils/socket";
import { useNavigate } from "react-router-dom";
import rtcmanager from "../../../core/RTCManager";
import { 
  Calendar,
  Clock,
  Video,
  MessageSquare,
  Activity,
  User,
  Bell,
  FileText,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function PatientDashboard({
  callStatus,
  updateCallStatus,
  setLocalStream,
  setRemoteStream,
  remoteStream,
  peerConnection,
  setPeerConnection,
  connectionType,
  setConnectionType,
}) {
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [patient, setPatient] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [upcomingAppointments] = useState([
    { date: "2025-01-20", time: "10:00 AM", doctor: "Dr. Smith", type: "Check-up" },
    { date: "2025-01-25", time: "2:30 PM", doctor: "Dr. Johnson", type: "Follow-up" }
  ]);
  const [healthMetrics] = useState({
    bloodPressure: "120/80",
    heartRate: "72 bpm",
    temperature: "98.6°F",
    lastUpdated: "2 hours ago"
  });

  const navigate = useNavigate();

  const handleConnectionType = useCallback((dataObj) => {
    setConnectionType(dataObj?.connectionType);
    if (dataObj?.id) {
      socket.emit("connection-type", {
        id: dataObj.id,
        connectionType: dataObj.connectionType,
      });
    }
  }, [setConnectionType]);

  useEffect(() => {
    const data = window.localStorage.getItem("data");
    const dataObj = JSON.parse(data);
    setPatient(dataObj);
    handleConnectionType(dataObj);
  }, [handleConnectionType]);

  useEffect(() => {
    socket.on("patient:message", (data) => {
      setMessage(data.message);
      setShowNotification(true);
    });
  }, []);

  async function initiateCall() {
    try {
      socket.emit("patient:request", {
        patient: patient,
        description: description,
      });

      const localStream = await rtcmanager.fetchMedia();
      updateCallStatus({
        ...callStatus,
        haveMedia: true,
        videoEnabled: true,
        audioEnabled: true,
      });
      setLocalStream(localStream);
    } catch (error) {
      console.error("Failed to initiate call:", error);
    }
  }

  useEffect(() => {
    if (callStatus.haveMedia && !peerConnection) {
      const { peerConnection, remoteStream } = rtcmanager.createPeerConnection(
        patient.id,
        true
      );
      setPeerConnection(peerConnection);
      setRemoteStream(remoteStream);
    }
  }, [callStatus.haveMedia, peerConnection, patient.id, setPeerConnection, setRemoteStream]);

  useEffect(() => {
    if (remoteStream && peerConnection) {
      navigate("/meet/patient");
    }
  }, [remoteStream, peerConnection, navigate]);

  function handleLogout() {
    socket.emit("patient:logout", patient);
    window.localStorage.removeItem("data");
    navigate("/");
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Rest of the JSX remains exactly the same */}
      {/* Header */}
      <motion.header 
        className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Welcome, {patient?.name || "Patient"}</h1>
            <p className="text-sm text-gray-500">Last login: Today at 9:00 AM</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
          >
            <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
            {showNotification && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
            )}
          </motion.div>
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden md:inline">Logout</span>
          </motion.button>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Actions */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            variants={itemVariants}
          >
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.button
                onClick={initiateCall}
                className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Video className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium text-green-700">Start Video Call</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Message Doctor</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calendar className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Schedule Visit</span>
              </motion.button>
              <motion.button
                className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileText className="h-6 w-6 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">View Records</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Health Metrics */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-6"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your Health Metrics</h2>
              <span className="text-sm text-gray-500">Last updated: {healthMetrics.lastUpdated}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <motion.div 
                className="p-4 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-gray-600">Blood Pressure</span>
                </div>
                <p className="text-xl font-semibold">{healthMetrics.bloodPressure}</p>
              </motion.div>
              <motion.div 
                className="p-4 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Heart Rate</span>
                </div>
                <p className="text-xl font-semibold">{healthMetrics.heartRate}</p>
              </motion.div>
              <motion.div 
                className="p-4 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  <span className="text-sm text-gray-600">Temperature</span>
                </div>
                <p className="text-xl font-semibold">{healthMetrics.temperature}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Message Area */}
          {message && (
            <motion.div 
              className="bg-white rounded-xl shadow-sm p-6"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-lg font-semibold mb-4">Recent Message</h2>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{message}</p>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <motion.div 
          className="space-y-6"
          variants={itemVariants}
        >
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <motion.div 
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span className="font-medium">{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="mt-2">
                    <p className="font-medium">{appointment.doctor}</p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Notes or Concerns */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Notes for Doctor</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Type any concerns or notes for your doctor..."
              className="w-full h-32 p-3 text-gray-700 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}