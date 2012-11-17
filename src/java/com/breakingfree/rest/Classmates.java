package com.breakingfree.rest;

import java.io.*;
import java.net.*;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import au.com.bytecode.opencsv.CSVReader;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;

//The Java class will be hosted at the URI path "/helloworld"
@Path("/api/classmates")
public class Classmates {

	// The Java method will process HTTP GET requests
	@GET
	// The Java method will produce content identified by the MIME Media
	// type "application/json"
	@Produces("application/json")
	// @Produces("text/html")
	public String getMostWanted() {


		StringWriter json = new StringWriter();
		String lastName;
		String firstName;
		String middleName;
		String suffix;
		String currentLastName;
		String name;
		String contactInfoStatus;

		try
		{
			URL mostWantedUrl = new URL("https://docs.google.com/a/breakingfree93.com/spreadsheet/pub?key=0AorXvig1X1NfdHV6STZPcWhreU5fTTBaWUIxU1ZVRkE&single=true&gid=0&output=csv");
			URLConnection connection = mostWantedUrl.openConnection();
			// json.write(convertStreamToString(connection.getInputStream()));
			// return json.toString();
			InputStreamReader in = new InputStreamReader(connection.getInputStream());
			CSVReader reader = new CSVReader(in);
			JsonGenerator g = (new JsonFactory()).createJsonGenerator(json);

			// Wrapper object
			g.writeStartObject();
			// Array of people
			g.writeArrayFieldStart("aaData");

			String [] nextLine = reader.readNext();
			while ((nextLine = reader.readNext()) != null) {
				// nextLine[] is an array of values from the line

				lastName = nextLine[0];
				firstName = "";
				middleName = "";
				suffix = "";
				currentLastName = "";
				contactInfoStatus = "";
				if (nextLine.length > 1)
				{
					firstName = nextLine[1];
				}
				if (nextLine.length > 2)
				{
					middleName = nextLine[2];
				}
				if (nextLine.length > 3)
				{
					suffix = nextLine[3];
				}
				if (nextLine.length > 4)
				{
					currentLastName = nextLine[4];
				}
				if (nextLine.length > 5)
				{
					contactInfoStatus = nextLine[5];
				}
				if (suffix.length() > 0)
				{
					lastName = lastName + " " + suffix;
				}
				if (currentLastName.length() > 0)
				{
					firstName = firstName + " (" + lastName + ")";
					lastName = currentLastName;
				}
				name = lastName + ", " + firstName;

				// Person
				g.writeStartArray();
				g.writeString(name);
				g.writeString(contactInfoStatus);
				g.writeEndArray();
			}
			// Array of people
			g.writeEndArray();
			// Wrapper object
			g.writeEndObject();
			g.close();
		}
		catch (IOException ioe)
		{
			json.write("{ error: 'Failed to retrieve most wanted list'}");
		}

		return json.toString();
	}

	String convertStreamToString(java.io.InputStream is) {
		java.util.Scanner s = new java.util.Scanner(is).useDelimiter("\\A");
		return s.hasNext() ? s.next() : "";
	}

}
