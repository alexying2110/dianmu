//#include <Arduino.h>
#include <SoftwareSerial.h>

/* baud rate */
#define BR 38400
/* receive port */
#define RX 8
/* transmission port */
#define TX 12
/* charge port */
#define CHARGE_PORT 4
/* out port */
#define OUTPUT_PORT 3


SoftwareSerial Peripheral(RX, TX);

void 
setup() 
{
  Serial.begin(BR);
  Serial.setTimeout(20000);

  Peripheral.begin(BR);
  Peripheral.setTimeout(20000);

  pinMode(CHARGE_PORT, OUTPUT);
  pinMode(OUTPUT_PORT, OUTPUT);
  Serial.println("Starting");

}

/* obviously normally you'd actually do the fucking
 * ascii shit but i'm tight on time and the bluetooth
 * wasn't working earlier so the less points of failure
 * the better
 */
void 
loop() 
{
  String s;
  if (Peripheral.available()) {
    s = Peripheral.readStringUntil('\r').c_str();
    Serial.print("Received: ");
    Serial.println(s);
    if (s.equals("ENQ")) {
      Peripheral.write("ACK\r");
      Serial.println("Received ENQ query");
    }
    if (s.equals("fire")) {
      //Peripheral.write((char) 0x06);
      Serial.println("Received fire command");
      digitalWrite(CHARGE_PORT, HIGH);
      delay(1500);
      digitalWrite(CHARGE_PORT, LOW);
      
      delay(200);
      digitalWrite(OUTPUT_PORT, HIGH);
      delay(200);
      digitalWrite(OUTPUT_PORT, LOW);
      delay(200);
      digitalWrite(OUTPUT_PORT, HIGH);
      delay(200);
      digitalWrite(OUTPUT_PORT, LOW);
      delay(200);
      digitalWrite(OUTPUT_PORT, HIGH);
      delay(200);
      digitalWrite(OUTPUT_PORT, LOW);
      delay(200);
      digitalWrite(OUTPUT_PORT, HIGH);
      delay(200);
      digitalWrite(OUTPUT_PORT, LOW);
      Peripheral.write("fired\r");
    }
    /* Write ACK for frontend to know that payload was received.
     * Probably redundant and too TCHARGE_PORT-like but might add a bit of
     * resilience.
     */
    //Peripheral.write((char) 0x04);
  }
}
