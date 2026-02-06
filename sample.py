
st.title("Hello World!")
st.write("This is my first Streamlit app.")

# You can also use magic commands (placing a variable on its own line)
"Here is some text using magic commands." 

# Add an interactive slider
x = st.slider("Select a value")
st.write(x, "squared is", x * x)
