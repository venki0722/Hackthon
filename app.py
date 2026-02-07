import streamlit as st
import joblib
import numpy as np

# Load saved model
model = joblib.load(".pkl")

st.set_page_config(page_title="Renewable Energy Predictor", layout="centered")

st.title("🌍 Renewable Energy Prediction System")
st.markdown("Predict energy output based on weather conditions")

st.divider()

# Input Section
st.subheader("Enter Weather Parameters")

temperature = st.number_input("🌡 Temperature (°C)", min_value=0.0)
pressure = st.number_input("🌪 Pressure (hPa)", min_value=0.0)
humidity = st.number_input("💧 Humidity (%)", min_value=0.0, max_value=100.0)
wind_speed = st.number_input("🌬 Wind Speed (m/s)", min_value=0.0)

st.divider()

if st.button("🔮 Predict Energy Output"):
    
    input_data = np.array([[temperature, pressure, humidity, wind_speed]])
    prediction = model.predict(input_data)

    st.success(f"⚡ Predicted Energy Output: {prediction[0]:.2f} Units")
