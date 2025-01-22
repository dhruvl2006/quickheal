import axios from "axios";

class APICalls {
  #server_url = process.env.REACT_APP_SERVER_URL||"http://localhost:3000";

  async loginDoctor(email, password) {
    const response = await axios.post(
      `${this.#server_url}/api/v1/auth/doctor/login`,
      {
        email,
        password,
      }
    );

    return response;
  }
  async registerDoctor(name, email, password, specialization) {
    const response = await axios.post(
      `${this.#server_url}/api/v1/auth/doctor/register`,
      {
        name,
        email,
        password,
        specialization,
      }
    );

    return response;
  }
  async loginPatient(email, password) {
    const response = await axios.post(
      `${this.#server_url}/api/v1/auth/patient/login`,
      {
        email,
        password,
      }
    );

    return response;
  }
  async registerPatient(name, email, password, age) {
    const response = await axios.post(
      `${this.#server_url}/api/v1/auth/patient/register`,
      { name, email, password, age }
    );

    return response;
  }

  async loginAdmin(email, password) {
    const response = await axios.post(
      `${this.#server_url}/api/v1/admin/login`,
      {
        email,
        password,
      }
    );

    window.localStorage.setItem("adminToken", response.data.token);

    return response;
  }
  async registerAdmin(name, email, password) {
    const response = await axios.post(
      `${this.#server_url}/api/v1/admin/register`,
      {
        headers: {
          authorization: `Bearer ${process.env.REACT_APP_PASSCODE}`,
        },
      },
      {
        name,
        email,
        password,
      }
    );

    return response;
  }
  async emptyDoctorQueue() {
    const response = await axios.post(
      `${this.#server_url}/api/v1/admin/empty/doctors`,
      {
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("adminToken")}`,
        },
      }
    );

    return response;
  }

  async emptyPatientQueue() {
    const response = await axios.post(
      `${this.#server_url}/api/v1/admin/empty/patients`,
      {
        headers: {
          authorization: `Bearer ${window.localStorage.getItem("adminToken")}`,
        },
      }
    );

    return response;
  }
}

const apiCalls = new APICalls();

export default apiCalls;
