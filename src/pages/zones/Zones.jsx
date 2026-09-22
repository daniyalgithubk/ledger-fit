



const Zones = () => {

    const CalculateZones = [
        {
            "icon": "age",
            "title":"Age"
        },
        {
            "icon": "heart",
            "title":"Max Heart Rate"
        }
    ]

    const ZoneInformation = [
        {
            "title": "Zone 1: Active Recovery",
            "description": "Light activity to promote recovery"
            
        },
        {
            "title": "Zone 2: Endurance",
            "description": "Build aerobic capacity"
        },
        {
            "title": "Zone 3: Tempo",
            "description": "Improve lactate threshold"
        },
        {
            "title": "Zone 4: Anaerobic Capacity",
            "description": "Increase power output"
        },
        {
            "title": "Zone 5: Maximum Effort",
            "description": "Sprint and all-out efforts"
        }
    ]
    return(
        <div>

             {/* ================= HEADER ================= */}
        <div>
            <p>TRAINING ZONES</p>
            <h1>Find Your Perfect Zone</h1>
            <p>Understand your heart rate zones and train at the 
                right intensity for better results</p>
        </div>

         {/* ================= Calculate Zones ================= */}
         <form className="shadow-lg mt-4">
            <h2>Calculate Your Zones</h2>
            <p>Enter your age or maximum heart rate to get personalized zones</p>
            <div className="flex flex-row">
                {
                    CalculateZones.map((item) => (
                        <div key={item.title}>
                            <img src={item.icon} alt={item.title} />
                            <h2>{item.title}</h2>
                        </div>
                    ))
                }
            </div>
            <div className="flex flex-col">
                <label>Your Age</label>
                <input placeholder="e.g 25"/>
                <button>Calculate Zones</button>
            </div>
        
         </form>

        {/* ================= Zone Information ================= */}
        <div className="shadow-lg">
            <div>
                 <h2>Your Heart Rate Zones</h2>
                 <p>Based on your age 25 | Max Heart Rate: 180 bpm</p>
                 <button>Edit</button>
            </div>
           
        </div>

        {/* ================= Info Card ================= */}
        <div className="shadow-lg">
            <h2>Why Heart Rate Zones?</h2>
            <p>Training in the right zone helps you</p>
            <ul>
                <li>Burn fat more efficiently</li>
                <li>Improve endurance and performance</li>
                <li>Reduce the risk of overtraining</li>
                <li>Get better results, faster</li>
            </ul>
        </div>



        </div>
       
    )
}

export default Zones;